import { Component, Prop, Mixins } from 'vue-property-decorator';
import { assign, cloneDeep, findIndex } from 'lodash';
import purchaseModule from 'store/modules/purchase';
import { getUploadFileObjectParams } from 'utils/helpers';
import { validProduct } from 'utils/product-attributes';
import { handleError } from 'components/Toast';
import { SpinLoading } from 'components/Loaders';
import { ProductAttributeEnum } from 'enums/product';
import Button from 'components/FormUI/Button';
import LocationMixin from 'components/FormUI/Location/LocationMixin';
import ProductAttributes from 'components/ProductAttribute';
import * as Styled from './styled';

@Component
export default class AddManuallyForm extends Mixins(LocationMixin) {
  @Prop({
    required: true,
  })
  successAdded: (manualData: Purchase.ManualAddedProduct) => void;

  private isLoading: boolean = false;
  private isSubmitting: boolean = false;
  private messageErrors: App.MessageError = null;
  private manualData: Purchase.ManualAddedProduct = {
    code: '',
    attributes: [],
  };

  get isDisabled(): boolean {
    return this.isSubmitting || !validProduct(this.manualData);
  }

  created(): void {
    this.fetchDataLocation();
    this.getProductDefinitions();
  }

  getProductDefinitions(): void {
    this.isLoading = true;
    purchaseModule.getProductDefinitions({
      callback: {
        onSuccess: (response: Purchase.ProductDefinitions) => {
          const { id, productDefinitionAttributes } = response;
          this.manualData.code = id;
          productDefinitionAttributes.forEach(
            (productAttribute: Purchase.ProductDefinitionAttribute) => {
              const { attribute, isOptional } = productAttribute;
              this.manualData.attributes = [
                ...this.manualData.attributes,
                {
                  category: attribute.category,
                  isOptional,
                  type: attribute.type,
                  id: attribute.id,
                  value: null,
                  quantityUnit: null,
                },
              ];
            },
          );
        },
        onFailure: (error: App.ResponseError) => {
          handleError(error);
        },
        onFinish: () => {
          this.isLoading = false;
        },
      },
    });
  }

  async getValueAttribute(
    attribute: Purchase.ManualAddedAttribute,
  ): Promise<Purchase.ManualAddedAttribute> {
    if (attribute.category === ProductAttributeEnum.ATTACHMENTS) {
      attribute.value = await getUploadFileObjectParams(
        attribute.value as File[],
      );
      return attribute;
    }

    return attribute;
  }

  async getValueUploadProofs(): Promise<Purchase.ManualAddedProduct> {
    const manualAddedProduct = cloneDeep(this.manualData);
    await Promise.all(
      manualAddedProduct.attributes.map(
        async (attribute: Purchase.ManualAddedAttribute) =>
          await this.getValueAttribute(attribute),
      ),
    );
    return manualAddedProduct;
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      const payload = await this.getValueUploadProofs();
      this.successAdded(payload);
      this.$emit('close');
    } catch (error) {
      handleError(error as App.ResponseError);
    } finally {
      this.isSubmitting = false;
    }
  }

  onClearMessageErrors(): void {
    if (this.messageErrors) {
      this.messageErrors = null;
    }
  }

  onChangeAttribute(params: Purchase.ManualAddedAttribute) {
    this.onClearMessageErrors();
    const { id } = params;
    const currentIndex = findIndex(
      this.manualData.attributes,
      (attribute: Purchase.ManualAddedAttribute) => attribute.id === id,
    );
    if (currentIndex > -1) {
      assign(this.manualData.attributes[currentIndex], params);
    }
  }

  renderProductAttributes(): JSX.Element {
    if (this.isLoading) {
      return (
        <Styled.Col>
          <SpinLoading />
        </Styled.Col>
      );
    }
    return (
      <ProductAttributes
        definitionAttributes={purchaseModule.productDefinitionAttributes}
        messageErrors={this.messageErrors}
        isSubmitting={this.isSubmitting}
        change={this.onChangeAttribute}
      />
    );
  }

  renderAction(hasErrors: boolean): JSX.Element {
    return (
      <Styled.Action>
        <Button
          width="100%"
          type="submit"
          variant="primary"
          label={this.$t('add')}
          isLoading={this.isSubmitting}
          disabled={this.isDisabled || hasErrors}
        />
      </Styled.Action>
    );
  }

  renderForm(): JSX.Element {
    return (
      <formulate-form
        name="addManuallyForm"
        vOn:submit={this.onSubmit}
        scopedSlots={{
          default: ({ hasErrors }: { hasErrors: boolean }) => (
            <Styled.Form>
              <perfect-scrollbar>
                {this.renderProductAttributes()}
              </perfect-scrollbar>
              {this.renderAction(hasErrors)}
            </Styled.Form>
          ),
        }}
      />
    );
  }

  render(): JSX.Element {
    return <Styled.Wrapper>{this.renderForm()}</Styled.Wrapper>;
  }
}
